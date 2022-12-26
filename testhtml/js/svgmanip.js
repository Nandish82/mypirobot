class Point
{
    constructor(x,y)
    {
        this.x=x;
        this.y=y;
    }
}

class link{

    // example link usage
   /*const link_1=new link(
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
    
    );*/
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

    setTransMat(a,b,c,d,e,f)
    {
        this.numericalT=[a,b,c,d,e,f];
        this.transform="matrix("+ a +","+ b +","+ c +","+ d +","+ e +","+ f +")"; 
        console.log(" Matrix was changed to"+this.transform+", "+this.numericalT) ;
    }

    getTransMat()
    {
        return this.numericalT; 
    }

    applyTrans(rot,trans)
    {
        //apply a matrix transformation to the current transform mat
        // rot has 4 elements in the form [w,x,y,z] and trans is [p,q]
        // if we write it in matrix form the original trans is [a c;b d]*[w y;x z]
        // [aw+cx ay+cz;bw+dx by+dz]  for translation it is e=e+p ,f=f+q

        let a=this.numericalT[0]*rot[0]+this.numericalT[2]*rot[1]; //a=aw+cx
        let b=this.numericalT[1]*rot[0]+this.numericalT[3]*rot[1]; //b=bw+dx
        let c=this.numericalT[0]*rot[2]+this.numericalT[2]*rot[3]; //c=ay+cz
        let d=this.numericalT[1]*rot[2]+this.numericalT[3]*rot[3]; //d=by+dz

        let e=this.numericalT[4]+trans[0];
        let f=this.numericalT[5]+trans[1];

        this.setTransMat(a,b,c,d,e,f);

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

    addToCanvas(ctx)
    {
        ctx.save(); // so as not to change th context
        ctx.setTransform(this.numericalT[0],this.numericalT[1],this.numericalT[2],this.numericalT[3],this.numericalT[4],
            this.numericalT  [5]);

        for(let i=0;i<this.path.length;i++)
        {   
            ctx.beginPath(); //clear any path which mayhave been stored earlier
            const p=new Path2D(this.path[i]);

            // a typical style in svg looks like " "stroke:black;fill:rgb(251,109,10);stroke-width:1""
            // we have to extract these elements and add them to canvas
            //
            const styles=this.style[i].split(";") //we spilt to get each property
            for(let j=0;j<styles.length;j++)
            {
               let style_val=styles[j].split(':'); //we then seperate the key and values
               switch(style_val[0])
               {
                case 'stroke':
                    ctx.strokeStyle=style_val[1];
                    break;
                case 'fill':
                    ctx.fillStyle=style_val[1];
                    break;
                case 'stroke-width':
                    ctx.lineWidth=style_val[1]*2; // seems stroke-width of svg is not same as line width in canvas. needs further investigation
                
               }
              
            
            }
            ctx.stroke(p);
            ctx.fill(p);
        }

        for(let i=0;i<this.joints.length;i++)
        {
            ctx.beginPath();
            ctx.arc(this.joints[i].x,this.joints[i].y,2,0,Math.PI*2);
            ctx.closePath();
            ctx.lineWidth=1;
            ctx.fillStyle='blue';
            ctx.fill();

        }
        ctx.restore();
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