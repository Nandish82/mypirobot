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
        this.path=path.split('#');
        this.style=style.split('#');
        this.joints=joints; //coordinate of joints i.e where they can connects
        this.jointCount=0;
        this.numericalT=this.str2Mat(this.transform);
    }

    str2Mat(transform)
    {
        // the transform matrix is given in a string of the form "matrix(a,b,c,d,e,f)"
        // extract the elements and put it in an array of 2x3 matrix [a c e;b d e]
        let pattern =/-?[0-9]\d*(\.\d+)?/g;
        let result=transform.match(pattern);
        let matrix=result.map(x=>x*1); // the result[x]*1 converts string to number
        console.log("the string to number conversion is:"+matrix);
        return matrix;


    }
    addJoint(jointName,jointCoordinate)
    {

    }

    createSVGElement()
    {
        let g=document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttributeNS(null,'id',this.id);
        g.setAttributeNS(null,"transform",this.transform);
        

       
        
        for(let i=0;i<this.path.length;i++)
        {
            let p=document.createElementNS('http://www.w3.org/2000/svg','path');
            p.setAttributeNS(null,'d',this.path[i]);
            p.setAttributeNS(null,'style',this.style[i]);

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
        var ctx = canv.getContext("2d");
        ctx.setTransform(this.numericalT[0],this.numericalT[1],this.numericalT[2],this.numericalT[3],this.numericalT[4],
            this.numericalT  [5]);

        for(let i=0;i<this.path.length;i++)
        {   
            ctx.beginPath(); //clear any path which mayhave been stored earlier
            const p=new Path2D(this.path[i]);

            // a typical style in svg looks like " "stroke:black;fill:rgb(251,109,10);stroke-width:1""
            // we have to extract these elements and add them to canvas
            //
            const styles=this.style[i].split(";")
            for(let j=0;j<styles.length;j++)
            {
               let style_val=styles[j].split(':');
               switch(style_val[0])
               {
                case 'stroke':
                    ctx.strokeStyle=style_val[1];
                    break;
                case 'fill':
                    ctx.fillStyle=style_val[1];
                    break;
                case 'stroke-width':
                    ctx.lineWidth=2;//style_val[1]*1;
                
               }
              
            
            }
            ctx.stroke(p);
            ctx.fill(p);
        }

        for(let i=0;i<this.joints.length;i++)
        {
            ctx.beginPath();
            ctx.arc(this.joints[i].x,this.joints[i].y,2,0,Math.PI*2);
            ctx.fillStyle='blue';
            ctx.fill();

        }
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