

const link_1=new link(
    "base-link-1",
    "matrix(2,0,0,-2,250,490)",
    //separate multiple path with #
    "M -17.5 0 h 35 L 10.75 31.31 A 11 11 180 0 1 -10.75 31.31 Z",
    "stroke:black;fill:rgb(251,109,10);stroke-width:1",
    [new Point(0,29)]
);

const link_2=new link(    
    "base-link-2",
    "matrix(2,0,0,-2,200,400)",
    //separate multiple path with #
    "M -13 0 A 13 13 0 0 1 13 0 v 39 h -3.5 v21.5 a 9.5 9.5 0 0 1 -19 0  v-21.5 h-3.5 Z",
    "stroke:black;fill:rgb(251,109,10);stroke-width:1",
    [new Point(0,60.5)] // joint coordinates

);




const link_3=new link(
    "base-link-3",
    "matrix(2,0,0,-2,200,200)",
    "M 9.5 -5 v 80 h-19 v -80 Z",
    "stroke:black;fill:rgb(251,109,10);stroke-width:1",
    [new Point(0,70)]
);



const link_4=new link(
    "base-link-4",
    "matrix(2,0,0,-2,300,250)",
    "M 9.5 0 A 9.5 9.5 0 0 0 -9.5 0 v 21.5 h 19 Z",
    "stroke:black;fill:rgb(251,109,10);stroke-width:1",
    [new Point(0,0)]
);


link_2.setParent(link_1);
link_3.setParent(link_2);
link_4.setParent(link_3);

link_1.setChild(link_2);
link_2.setChild(link_3);
link_3.setChild(link_4);

let _angle=0;

function main()
{
    console.log("Main has been executed");
 

    const svg=document.getElementById("svg-1");
    svg.appendChild(link_1.createSVGElement());
    svg.appendChild(link_2.createSVGElement());

    pauseBrowser(10);
    console.log("timer out");

    const g=document.getElementById('base-link-2');
    g.setAttributeNS(null,'transform','matrix(2,0,0,-2,100,400)');

    // draw links
    draw([link_1,link_2,link_3,link_4]);
    

}

function draw(links)
{
    const canv=document.getElementById("myCanvas");

    const ctx=canv.getContext("2d");
    ctx.clearRect(0,0,500,500);

    for(let i=0;i<links.length;i++)
    {
        links[i].addToCanvas(ctx);
    }
}

window.onload=main();

function pauseBrowser(millis) {
    var date = Date.now();
    var curDate = null;
    do {
        curDate = Date.now();
    } while (curDate-date < millis);
}

function buttonclicked(val)
{
    console.log(" I was clicked");
    _angle=(Math.PI/180)*10;
    console.log("Angle: " + _angle*180/Math.PI);
    let c=Math.cos(_angle);
    let s=Math.sin(_angle);
    let tf=[[c,-s,0],
            [s,c,0],
            [0,0,1]];

    if (val==1)
    {
        link_2.applyTrans(tf);
    }
    else
    {
        link_3.applyTrans(tf)
    }

    draw([link_1,link_2,link_3,link_4]);
}