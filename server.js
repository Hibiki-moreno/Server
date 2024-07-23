const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors')
const https = require('https')
var fss  = require ('fs')
const bodyParser = require('body-parser');
const {spawn} = require('child_process')

app.use(cors());

var key=fss.readFileSync('encryption/server.key');
var cert=fss.readFileSync('encryption/server.cert');

var httpsOptions={
	key:key,
	cert:cert
};
// Lista blanca de direcciones IP permitidas
const allowedIPs = ['::ffff:192.168.106.231','::ffff:192.168.106.170','::ffff:192.168.100.42','::ffff:192.168.100.15','::ffff:192.168.100.21','::ffff:192.168.100.28','::ffff:192.168.100.19', '192.168.100.28']; // Agrega aquí las direcciones IP permitidas
 

// Middleware para verificar la dirección IP del cliente
const restrictAccess = (req, res, next) => {
  const clientIP = req.ip;
  if (allowedIPs.includes(clientIP)) {
      // Permitir acceso si la IP del cliente está en la lista blanca
      next();
     
  } else {
      // Denegar acceso si la IP del cliente no está en la lista blanca
      res.status(403).send('Acceso prohibido');
      console.log('imbecil')
      console.log(clientIP)
  }
};

// Aplicar middleware de restricción de acceso a todas las rutas
app.use(restrictAccess);

  // Configurar Express para analizar el cuerpo de la solicitud como JSON
  app.use(express.json());
  app.use(bodyParser.urlencoded({ extended: true }));

// Manejar la solicitud del navegador para ejecutar el cliente Node.js
app.post('/ejecutarCliente', (req, res) => {
  const { ip, puerto,palabra } = req.body;

  const rutaCompleta = path.join('c:', 'Wave-fi', 'js','client.js');
  // Iniciar el cliente Node.js con la dirección IP y el puerto proporcionados
  const cliente = spawn('node', [rutaCompleta, ip, puerto,palabra]);

 console.log(ip,puerto,palabra)

  // Manejar la salida estándar del cliente
  cliente.stdout.on('data', (data) => {
    console.log(`Salida estándar del cliente: ${data}`);
  });

  // Manejar la salida de errores del cliente
  cliente.stderr.on('data', (data) => {
    console.error(`Error del cliente: ${data}`);
  });

  // Manejar eventos de cierre del proceso del cliente
  cliente.on('close', (code) => {
    console.log(`Proceso del cliente cerrado con código de salida ${code}`);
  });

  res.sendStatus(200); // Responder al navegador
});



// Define la ruta para los archivos estáticos (como HTML, CSS, imágenes, etc.)
app.use(express.static(path.join('C:\\Wave-fi')));

// Configurar el tipo MIME para los archivos JavaScript
app.use(express.static('C:\\Wave-fi', {
  setHeaders: (res, path, stat) => {
    if (path.endsWith('.js')) {
      res.set('Content-Type', 'application/javascript');
    }

    
  }
}));


// Define la ruta para los archivos estáticos (como HTML, CSS, imágenes, etc.)
app.use(express.static('C:\\Wave-fi', {
  setHeaders: (res, path, stat) => {
    if (path.endsWith('.js')) {
      res.set('Content-Type', 'application/javascript');
    }
  }
}));




// Ruta de inicio
app.get('/', (req, res) => {
  res.sendFile(path.join('C:\\Wave-fi', 'index.html'));
});

// Puerto en el que se ejecutará el servidor
const PORT = process.env.PORT || 3000;

// Iniciar el servidor
server=https.createServer(httpsOptions,app).listen(PORT,()=>{
  console.log('Aquiles server activated ! ',PORT);
});

  
  
  
