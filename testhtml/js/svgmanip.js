class Point
{
    constructor(x,y)
    {
        this.x=x;
        this.y=y;
    }
}

class link{
    constructor(id,transform,path,style="stroke:black;fill=none",joints)
    {
        // id is a string
        // transform takes a string of the form
        //  "matrix(a,b,c,d,e,f)"
        //  [a c e;b d e] a 2x3 matrix
        //the style is css style string
        // "stroke:black;fill:none"
        // if multiple path and multiple style exist
        // they are seperated by a '#'
        this.id=id;
        this.transform=transform;
        this.path=path;
        this.style=style;
        this.joints=joints; //coordinate of joints i.e where they can connects
        this.jointCount=0;
    }
    addJoint(jointName,jointCoordinate)
    {

    }

    createSVGElement()
    {
        let g=document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttributeNS(null,'id',this.id);
        g.setAttributeNS(null,"transform",this.transform);
        const path_str=this.path.split('#');
        const style_str=this.style.split('#');

       
        
        for(let i=0;i<path_str.length;i++)
        {
            let p=document.createElementNS('http://www.w3.org/2000/svg','path');
            p.setAttributeNS(null,'d',path_str[i]);
            p.setAttributeNS(null,'style',style_str[i]);

            g.appendChild(p)
        }

        for(let i=0;i<this.joints.length;i++)
        {
            let c=document.createElementNS('http://www.w3.org/2000/svg','circle');
            c.setAttributeNS(null,'cx',''+this.joints[i].x);
            c.setAttributeNS(null,'cy',''+this.joints[i].y);
            c.setAttributeNS(null,'r','2');
            c.setAttributeNS(null,'style','fill:blue');

            g.appendChild(c);

        }
        
        return g;
    }

    addToCanvas(canv)
    {

    }
}

function calcIntersectionPt()
{
    let c_x=0;
    let c_y=29;
    let r=11;

    let a_x=17.5;
    let a_y=0;
    let dx=a_x-c_x;
    let dy=Math.abs(a_y-c_y);
    let R=Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2));

    let alpha=Math.atan((dx)/(dy));

    let theta=alpha-Math.asin(r/R);

    let y=c_y+r*Math.sin(theta);
    let x=c_x+r*Math.cos(theta);

    let r2=Math.pow((x-c_x),2)+Math.pow(y-c_y,2)
    console.log("the radius to the square="+r2)
    console.log("x= " +x +", y="+y);
}