const express = require('express')
const app = express();
const color = require("colors")   // para dar color a las letras
const joi = require("@hapi/joi"); // para crear validaciones del esquema
const config = require("config"); // para las configuraciones del sistema ("config") es la carpeta
const morgan = require("morgan"); // hace el registro de las peticiones http en consola
const iniciodebug = require("debug")("app:inicio") //para las depuraciones
const iniciodbdebug = require("debug")("app:db"); // para depurar la base de datos

//const logger = require("./logger"); // importamos el log del otro modulo            
//app.use(logger); // llamamos a la variable que representa al modulo logger

app.use(express.json());                      // para usar el json en el POST o http
app.use(express.urlencoded({extended:true})); // para usar parametros en el http
app.use(express.static("public"));            //para usar recursos del proyecto y que se vea



//imprimiendo el morgan (iniciando el servidor)
if(app.get("env")==="development"){
    app.use(morgan("tiny")); // usamos morgan cuando es para desarrollo si ENV = development
   // console.log("Iniciando con morgan");
    iniciodebug("Morgan esta habilitado !!")

}

// trabajando con la base de datos
iniciodbdebug("Conectando con la base de datos .....");

//imprimiendo cofiguraciones de entornos
console.log("APLICACION : "+ config.get("nombre"));
console.log("DATA BASE : "+ config.get("configDB.host"));





           //esquema del objeto a validar
const esquema = joi.object({
    nombre: joi.string().min(3).required()
});


        // Un arreglo para usar con lass peticiones Http
const usuarios =[
{id:1, nombre:"Jordi",profession:"Developer"},
{id:2, nombre:"Juan",profession:"Contador"},
{id:3, nombre:"Pedro",profession:"Abogado"},
{id:4, nombre:"Elias",profession:"Arquitecto"},
{id:5, nombre:"Antonio",profession:"Abogado"}
];



// METODOS GET
app.get('/node',(req,res)=>{  // peticion  simple
res.send('Hola a todos desde el servidor de NODE JS');
});


app.get("/api/usuarios/:id",(req,res)=>{ // obtener datos por variable id
    let usua = usuarios.find(u => u.id === parseInt(req.params.id));
    if(!usua)res.status(404).send("Usuario no encontrado o no existe");
    res.send(usua);
})

app.get("/api/consulta",(req,res)=>{ //  imprime el query
    res.send(req.query);
})


// POST

app.post("/api/usuarios/crear",(req,res)=>{

    const {resultado,error} = esquema.validate({nombre:req.body.nombre}) // otra forma de validar
    
if(!error){
    const usuarionuevo = { id: usuarios.length+1 ,
        
        nombre:req.body.nombre , 
        profession:req.body.profession}

        usuarios.push(usuarionuevo);
    res.send(usuarionuevo);

}else{
    const mensaje = error.details[0].message;
    res.status(400).send(mensaje);

}
    // esta es una validacion simple

    // if(!req.body.nombre || req.body.nombre.length<=2){ // validacion
    //     //res.status(404); una opcion para que salga el 404
    //     res.send("el nombre debe tener almenos 3 caracteres");
    //     return;
    // }
   

})












const port = process.env.port || 3000;

// CONTROL + } comenta las lineas en visual code



app.listen(port,()=>{
    console.log(`servidor iniciado en el pueto ${port}`.green);
});



