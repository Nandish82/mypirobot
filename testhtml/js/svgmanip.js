


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
        this.matrixT=matx.zeros(3,3);
        this.matrixT=this.str2Mat(this.transform);
        this.parent=null;
        this.child=null;
        

    }

    setTransMat(matA)
    {
        let a=matA[0][0];
        let b=matA[1][0];
        let c=matA[0][1];
        let d=matA[1][1];
        let e=matA[0][2];
        let f=matA[1][2];
        this.matrixT=[[a,c,e],
                      [b,d,f],
                      [0,0,1]];
        this.transform="matrix("+ a +","+ b +","+ c +","+ d +","+ e +","+ f +")"; 
        console.log(" Matrix was changed to"+this.transform+", "+this.matrixT) ;
    }

    getTransMat()
    {
        return this.matrixT; 
    }

    applyTrans(transformMatrix)
    {
        //apply a matrix transformation to the current transform mat
        //transformMatrix is a 3x3 homogenous matrix

        let A=matx.mult(this.matrixT,transformMatrix);
        let a=A[0][0];
        let b=A[1][0];
        let c=A[0][1];
        let d=A[1][1];
        let e=A[0][2];
        let f=A[1][2];

        let child=this.child;
        let newT=A;
        while(child!=null)
        {
            // Tpc transformation of child in parent
            let Tpc=matx.mult(matx.inv(child.parent.matrixT),child.matrixT);
            newT=matx.mult(newT,Tpc);
            child.setTransMat(newT);
            child=child.child;
            
        }

        this.setTransMat(A);

    }
    getDet()
    {
        // returns the determinant of the transform matrix

    }
    str2Mat(transform)
    {
        // the transform matrix is given in a string of the form "matrix(a,b,c,d,e,f)"
        // extract the elements and put it in an array of 2x3 matrix [a c e;b d e]
        let pattern =/-?[0-9]\d*(\.\d+)?/g;
        let result=transform.match(pattern);
        let matrix=result.map(x=>x*1); // the result[x]*1 converts string to number
        let matrixT=[[matrix[0],matrix[2],matrix[4]],
                     [matrix[1],matrix[3],matrix[5]],
                    [0,0,1]];
        console.log("the string to number conversion is:"+matrixT);
        return matrixT;


    }
    addJoint(jointName,jointCoordinate)
    {

    }

    setParent(parent)
    {
        // sets the parent element of the link.
        this.parent=parent;
        let parentTransform=this.parent.getTransMat();
        let parentJoint=this.parent.joints;
        // parent in world =T_01
        // this in world   =T_02
        // this in parent=T_12=inv(T_01)*T_O2
        let T_12=(matx.mult(matx.inv(parentTransform),this.matrixT));

        ///move joint to joint in parent
        T_12[0][2]=parentJoint[0].x;
        T_12[1][2]=parentJoint[0].y;
        
        

        // transfrom back to world coordinates
        //T_O2=T_01*T12;
        let t02=matx.mult(parentTransform,T_12);
        this.setTransMat(t02);

    }

    setChild(child)
    {
        this.child=child;
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
        let A=this.matrixT;
        let a=A[0][0];
        let b=A[1][0];
        let c=A[0][1];
        let d=A[1][1];
        let e=A[0][2];
        let f=A[1][2];
        ctx.setTransform(a,b,c,d,e,f);

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

function RowEchelon()
{

}