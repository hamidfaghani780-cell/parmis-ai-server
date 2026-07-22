const express = require("express");
const cors = require("cors");
const fs = require("fs");
require("dotenv").config();

const Groq = require("groq-sdk");

const app = express();

app.use(cors());
app.use(express.json());


const personality = fs.readFileSync(
"./parmis-personality.txt",
"utf8"
);


const products = JSON.parse(
fs.readFileSync(
"./products-ai.json",
"utf8"
)
);


const groq = new Groq({
apiKey: process.env.GROQ_API_KEY
});


app.get("/", (req,res)=>{

res.json({
status:"Parmis AI Server is running"
});

});


app.post("/chat", async(req,res)=>{

try{

const message = req.body.message;


const completion = await groq.chat.completions.create({

model:"llama-3.3-70b-versatile",

messages:[

{
role:"system",
content:
personality +
`

قانون بسیار مهم موجودی:
فقط محصولاتی را موجود فرض کن که در لیست محصولات زیر وجود دارند.
اگر محصولی در این لیست نبود، هرگز نگو موجود است.
هرگز محصولی را از خودت نساز.
اگر مشتری محصولی خواست که در لیست نیست، توضیح بده که فعلاً موجود نیست و از بخش ارتباط با ما درخواست ثبت کند.

لیست محصولات موجود فروشگاه:
` +
JSON.stringify(products)
},

{
role:"user",
content:message
}

]

});


let answer = completion.choices[0].message.content;


let cleanAnswer = answer
.replace(/[A-Za-z]/g,"")
.replace(/[^\u0600-\u06FF0-9\s.,!?🌸🙂😊\n]/g,"")
.trim();


res.json({

answer:cleanAnswer

});


}

catch(error){

console.log("GROQ ERROR:");
console.log(error.message);


res.json({

answer:
"متأسفانه ارتباط با مشاور پارمیس برقرار نشد. لطفاً دوباره تلاش کنید 🌸"

});

}


});


const PORT = process.env.PORT || 3000;


app.listen(PORT,()=>{

console.log(
`Parmis AI Server running on port ${PORT}`
);

});
