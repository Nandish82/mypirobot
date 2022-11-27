function main()
{
    console.log("Main has been executed");
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

    const svg=document.getElementById("svg-1");
    svg.appendChild(link_1.createSVGElement());
    svg.appendChild(link_2.createSVGElement());

    pauseBrowser(10000);
    console.log("timer out");

    const g=document.getElementById('base-link-2');
    g.setAttributeNS(null,'transform','matrix(2,0,0,-2,100,400)');
    

}

window.onload=main();

function pauseBrowser(millis) {
    var date = Date.now();
    var curDate = null;
    do {
        curDate = Date.now();
    } while (curDate-date < millis);
}