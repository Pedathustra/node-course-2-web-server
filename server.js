//this
const express = require('express');
const hbs =require('hbs');
const fs=require('fs'); // to log a file
const port  = process.env.PORT || 3000;

var app = express();

hbs.registerPartials(__dirname + '/views/partials');

//telling our program what view engine we'd like to use. We are using Handlebars
app.set('view engine', 'hbs');



//app.use to register an object . next is there so you can tell middleware when you're done
//you can have as much middleware as you like registered to an Express app.
//you can have it log things to the screen, measure response times, etc
//you have a bunch of stuff available via req, res. You can find that out here: https://expressjs.com/en/4x/api.html
app.use((req,res,next)=>{
    var now = new Date().toDateString();
    var log = `${now}: ${req.method} ${req.url}`;

    console.log(log);
    fs.appendFile('server.log', log + '\n', (err)=>{
        if(err){
            console.log('Unable to append server.log.');
        }
    });
    next(); //need next to include this otherwise won't
    }
);
/*
uncomment to put in maintenance mode

// here's an example where you never call next...say you're in maintenance mode.
app.use((req,res,next)=>{
        res.render('maintenance.hbs',{
            pageTitle: 'Home Page',
            welcomeMessage: 'We\'ll be right back! ',
            maintenanceMessage: 'Conducting maintenance right now!'
        }); //to render
    }
);
*/
//this is  built-in express middleware
//takes absolute path to folder __dirname variable that gets passed into our function by that wrapper function
app.use(express.static(__dirname + '/public'));



//name value pairs that can be referenced anywhere
//getCurrentYear can be referenced anywhere
hbs.registerHelper('getCurrentYear', ()=>{
    return new Date().getFullYear();

});

hbs.registerHelper('screamIt', (text)=>{
    return text.toUpperCase();
})

//register a handler for an http get reqeuest
//first argument is the url on our server where we handle the request. Here, it's the root of the app.
// second is the function to run
/*
app.get('/', (req, res)=>{ //request (stores info about request coming in. method, body, path)), response (bunch of methods avail to you so you can respond))
   // res.send('<h1>Hello Express!</h1>');
    res.send({
        name: 'Pebbles',
        likes:['frisbee','peanut butter', 'swimming pool']

    })
});
*/
app.get('/',(req,res)=>{
        res.render('home.hbs',{
            pageTitle: 'Home Page',
            welcomeMessage: 'I am a golden god! '
        }); //to render
    }
);
app.get('/about',(req,res)=>{
        res.render('about.hbs',{
            pageTitle: 'About Page',
        }); //to render
    }
);


app.get('/projects',(req,res)=>{
        res.render('projects.hbs',{
            pageTitle: 'Projects Page',
            projectsMessage: 'I have a new project idea! '
        }); //to render
    }
);

/*
app.get('/about',(req,res)=>{
    res.send('About Page');
    }
);
*/
//bad simulates when
app.get('/bad', (req,res)=>{
   res.send(
       {
           errorMessage: 'Unable to fulfil your honkey-ass request'
       }
   );
});

//this is the port to listen for such requests. 3000 is a common dev port.
//optional second argument takes a function that tells it to do something once server is up.
app.listen (port, ()=>{ //  use environment variable (port) so heroku can dynamically handle deploy
    console.log(`Server up on port ${port}!`)
});
