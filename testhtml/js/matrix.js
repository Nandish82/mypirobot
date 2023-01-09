
const matx_debug_flag=0;
class matx{
    constructor(){
        /*try {
            let check=this.check_matrix(m);

            if (!check)
            {
                throw new SyntaxError("Matrix do not have the same number of columns");
            }
            else
            {
                this.m=m;
                this.no_cols=m[0].length;
                this.no_rows=m.length;
            }
        }
        catch(err)
        {
            alert("Matrix not valid: "+err.message);
        }*/

    }

    static copy(m)
    {
        let n=[[0]];
        let no_cols=m[0].length;
        let no_rows=m.length;
        for(let row=0;row<no_rows;row++)
        {
            n[row]=[...m[row]]; //array copying is a shallow copy in javascript the spread operator '...' allows for deep copy
           
        }
        return n;
    }

    static exchange_rows(mat,row1,row2)
    {
        // matrix is the matrix
        // row1 and row2 are the rows to be exchanged
        
        let matrix=matx.copy(mat);

        if (matx.check_matrix(matrix)==1)
        {
            let temp=matrix[row1];
            matrix[row1]=matrix[row2];
            matrix[row2]=temp;
        }
        return matrix;

    }

   static  check_matrix(matrix)
    {
        // check if a matrix is correct
        // by checking that all cols have same number of elements
        let no_rows=matrix.length;
        let no_cols=matrix[0].length;

        for(let j=0;j<no_rows;j++)
        {
            if (matrix[j].length!=no_cols)
                {
                    return 0
                }
        }
        return 1;
    }

    static add_k_rowb_to_rowa(mat,rowA,rowB,k)
    {
        // add to rowA the value of k*rowB
        // rowA=rowA+k*rowA
        
        let matrix=matx.copy(mat);
        let no_rows=matrix.length;
        let no_cols=matrix[0].length;

        for(let col=0;col<no_cols;col++)
        {
            
            matrix[rowA][col]+=matrix[rowB][col]*k;

            if (Math.abs(matrix[rowA][col])<2000*Number.EPSILON)
            {
                matrix[rowA][col]=0;
            }
        }
        if (matx_debug_flag==1)
        {   
            console.log("==Elementary row operation 1===");
            console.log("Before manipulation");
            matx.printMatrix(mat);
            console.log("Add " +k + " times row " + rowB +" to row " + rowA );
            matx.printMatrix(matrix);
        }
        
        return matrix;
    }

    static printMatrix(mat)
    {
        for(let i=0;i<mat.length;i++)
        {
            let arr=mat[i];
            console.log(arr.toString());
        }
    }

    static multiply_rowA_by_k(mat,row,k)
    {
        
        let n=matx.copy(mat);
        let no_cols=n[0].length;

        for(let col=0;col<no_cols;col++)
        {
            n[row][col]=k*n[row][col];
        }

        if(matx_debug_flag==1)
        {
            console.log("==Elementary row operation 2===");
            console.log("Before manipulation");
            matx.printMatrix(mat);
            console.log("Multiply Row " + row +" by " + k );
            matx.printMatrix(n);
        }
       
        return n;
    }

    static reorder(mat,col)
    {
        //reorder by col
        //reorder the rows so that the cols are in descending order
        // e.g
        // [[1,2],[3,4]] --> [[3,4],[1,2]]

    }

    static identity_mat(order)
    {
        let n=[];
        for (let i=0;i<order;i++)
        {
            n[i]=[];
            for(let j=0;j<order;j++)
            {
                if(i==j)
                {
                    n[i][j]=1;
                }
                else
                {
                    n[i][j]=0;
                }
            }
        }
        return n;
    }

    static zeros(rows,cols)
    {
        let n=[];
        
        for(let i=0;i<rows;i++)
        {
            n[i]=[];
            for(let j=0;j<cols;j++)
            {
                n[i][j]=0;
            }

        }
            
        return n;
    }

    static mult(matA,matB)
    {
        let n_row_A=matA.length;
        let n_col_A=matA[0].length;
        let n_row_B=matB.length;
        let n_col_B=matB[0].length;

        let m=matx.zeros(n_row_A,n_col_B);

        if (n_col_A==n_row_B)
        {
            for(let i=0;i<m.length;i++)
            {
                for(let j=0;j<m[0].length;j++)
                {   let s=0;
                    for(let k=0;k<n_col_A;k++)
                    {   

                        m[i][j]+=matA[i][k]*matB[k][j];

                        if(Math.abs(m[i][j])<2000*Number.EPSILON)
                        {
                            m[i][j]=0;
                        }

                    }
                }
            }
        }
        return m;

        
    }

    static inv(A)
    {
        let no_rows=A.length;
        let no_cols=A[0].length;
        let n=matx.copy(A);
        let iden=matx.identity_mat(A.length);
        // use gaussian elimination to get the inverse

        // make sure that the matrix is square
        if (no_rows!=no_cols)
        {
            console.log("Matrix is not square");
            return -1;
        }

        let aug=matx.gaussian_elimination(n,iden);

        for(let i=0;i<no_rows;i++)
        {
            for(let j=no_cols;j<2*no_cols;j++)
            {
                n[i][j-no_cols]=aug[i][j];
            }
        }
        return n;



       
    }

    static max_in_row(A,col)
    {
        /// takes a matrix A and a col 
        /// returns the row-index of the maximum value in that col

        let max=0;
        let row_idx=-1;
        let row_len=A.length;

        for(let i=col;i<row_len;i++) // i starts at col because it cannot take rows above it 
        {
            if (Math.abs(A[i][col])>max)
            {
                row_idx=i;
                max=Math.abs(A[i][col]);
            }
        }
        return row_idx;
    }

    static ge2(A,b)
    {
        // perform gaussian elimination over the augmented matrix
        // [A|B]
        // A and B should have same number of rows
        let no_rows=A.length;
        let no_cols=A[0].length;

        if (no_rows!=b.length)
        {
            console.log("A and b do not have same number of rows");
            return -1;  //should be a custom error
        }
        //create augmented matrix
        let aug=matx.zeros(no_rows,no_cols+b[0].length);

        for(let row=0;row<no_rows;row++)
        {
            for(let col=0;col<no_cols+b[0].length;col++)
            {
                if(col<no_cols)
                {
                    aug[row][col]=A[row][col];
                }
                else
                {
                    aug[row][col]=b[row][col-no_cols];
                }
            }
        }

        /// adapted from wikipedia
        let h=0; // pivot row
        let k=0; // pivot col

        while(h<no_rows && k<no_cols)
        {
            let i_max=matx.max_in_row(aug,k);
            if (i_max==-1)
            {
                k=k+1;
            }
            else
            {
                aug=matx.exchange_rows(aug,h,i_max);
                for(let i=h+1;i<no_rows;i++)
                {
                    let f=aug[i][k]/aug[h][k]
                    aug[i][k]=0;
                    for(let j=k+1;j<no_cols;j++)
                    {
                        aug[i][j]=aug[i][j]-aug[h][j]*f;
                    }
                    
                }
                h=h+1;
                k=k+1;
            }
        }
        return aug;


    }

    static gaussian_elimination(A,b)
    {
        // perform gaussian elimination over the augmented matrix
        // [A|B]
        // A and B should have same number of rows
        let no_rows=A.length;
        let no_cols=A[0].length;

        if (no_rows!=b.length)
        {
            console.log("A and b do not have same number of rows");
            return -1;  //should be a custom error
        }
        //create augmented matrix
        let aug=matx.zeros(no_rows,no_cols+b[0].length);

        for(let row=0;row<no_rows;row++)
        {
            for(let col=0;col<no_cols+b[0].length;col++)
            {
                if(col<no_cols)
                {
                    aug[row][col]=A[row][col];
                }
                else
                {
                    aug[row][col]=b[row][col-no_cols];
                }
            }
        }

        
        // start with pivot element (0,0)
        for(let col=0;col<no_cols;col++)
        {   
            let exchange=matx.max_in_row(aug,col);
            if(exchange==-1)
            {
                continue;
            }
            else
            {
                aug=matx.exchange_rows(aug,exchange,col);
            }
            let pivot=aug[col][col]

            for(let row=col+1;row<no_rows;row++)
            {
                let a=aug[row][col];
                if (Math.abs(a)<1e-10)
                {

                }
                else
                {
                    // a(i,j)+k*pivot=0 =>k=-a(i,j)/pivot
                    let k=(-a/pivot)*1.0;
                    aug=matx.add_k_rowb_to_rowa(aug,row,col,k);
                    
                }   
                
                 /// now reduce matrix to row echelon form i.e diagonal elements should be 1
            
            } // matrix is now an upper diagonal
            let u=1/aug[col][col];
            aug=matx.multiply_rowA_by_k(aug,col,u);
        }

           

            //now move backwards starting with the right most pivot
            for(let col=no_cols-1;col>=0;col--)
            {
                let pivot=aug[col][col];
                if (Math.abs(pivot)<1e-10)
                {
                    continue;
                }
                for(let row=col-1;row>=0;row--)
                {
                    if (Math.abs(aug[row][col])<1e-10)
                    {
                        continue;
                    }
                    let u=-aug[row][col]/pivot;
                    aug=matx.add_k_rowb_to_rowa(aug,row,col,u);
                }
            }
         
        
        

        
        return aug;

    }



    static rref(mat)
    {
        let n=matx.copy(mat);
        let no_cols=n[0].length;
        let no_rows=n.length;

        /*let r=0;

        for(let col=0;col<no_cols;col++)
        {
            let row=r+1;
            while(row<no_rows && n[row][col]==0)
            {
                row=row+1;
            }
            if (row<no_rows)
            {
                r=r+1;
                n=matx.exchange_rows(n,row,r);
                n=matx.multiply_rowA_by_k(n,r,1/n[r][col]);
                for(let k=0;k<no_rows;k++)
                {
                    if(k!=r)
                    {
                        let kk=(-n[k][col]/n[r][col]);
                        n=matx.add_k_rowb_to_rowa(n,k,r,kk);
                    }
                }
            }
        }*/

        for(let i=0;i<no_rows;i++)
        {
            let p=n[i][i];
            n=matx.multiply_rowA_by_k(i,1/p)
            for(let j=0;j<no_rows;i++)
            {
                if (j==i)
                {
                    continue;
                }
            }
        }
        return n;

    }

}


