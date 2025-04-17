const express=require('express')
const cors=require('cors')

const app=express();
 const port=3330;

 app.use(cors())

 const dataGenerate=()=>{
    const names=['swe','nive','hari','bharani','pranav','srinithi','priya','sudha','elakiya','ramya','kaviya','tanari']
    const cities=['tiruvallur','chitathur','ranipet','karur','chennai','pondi','kanyakumari','trichy','poonamalle','salem','guindy','perambur']
    const data=[]


    for(i=1;i<=10;i++){
        data.push({
            id:i,
            name:names[i%names.length],
            age:Math.floor(Math.random()*100),
            city:cities[i%cities.length],
            score:(Math.random()*100).toFixed(2)

        })

    }

    return data;

}

const allData=dataGenerate();

app.get('/data',(req,res)=>{

    const {offset=0,limit=10} =req.query;
    const slice=allData.slice(offset,+offset + +limit );
    res.json({data:slice})
}

)

app.listen(port,()=>console.log(`app running at the port http://localhost:${port}`))
