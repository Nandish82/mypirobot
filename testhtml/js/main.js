
const link_1=new link(
    "base-link",
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
    "M -13 0 A 13 13 0 0 1 13 0 v 39 h -26 Z",
    "stroke:black;fill:rgb(251,109,10);stroke-width:1",
    [new Point(0,0), new Point(0,39)] // joint coordinates

);

const link_3=new link(
    "base-link-3",
    "matrix(2,0,0,-2,200,250)",
    "M -9.5 0 A 9.5 9.5 0 0 0 9.5 0 v -21.5 h -19 Z",
    "stroke:black;fill:rgb(251,109,10);stroke-width:1",
    [new Point(0,0)]
);

const link_4=new link(
    "base-link-4",
    "matrix(2,0,0,-2,200,200)",
    "M 9.5 -5 v 80 h-19 v -80 Z",
    "stroke:black;fill:rgb(251,109,10);stroke-width:1",
    [new Point(0,0)]
);

const link_5=new link(
    "base-link-5",
    "matrix(2,0,0,-2,300,250)",
    "M 9.5 0 A 9.5 9.5 0 0 0 -9.5 0 v 21.5 h 19 Z",
    "stroke:black;fill:rgb(251,109,10);stroke-width:1",
    [new Point(0,0)]
);

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
    draw([link_1,link_2,link_3,link_4,link_5]);
    

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

function buttonclicked()
{
    console.log(" I was clicked");
    _angle=(Math.PI/180)*10;
    console.log("Angle: " + _angle*180/Math.PI);
    let rot=[Math.cos(_angle),Math.sin(_angle),-Math.sin(_angle),Math.cos(_angle)];
    let trans=[0,0];
    link_2.applyTrans(rot,trans);
    draw([link_1,link_2]);
}