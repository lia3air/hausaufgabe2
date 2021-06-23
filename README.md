## Getting Started 

### install dependencies

    $ npm i
    
### run docker container

    $ docker-compose up 
    
### start the server

    $ node src/main.js    

### Example input (localhost:3000/graphql)

   mutation {
     createBoard(
          board:{owner:"60c72f84d2627b0006ead57f"}
     )
     {
       _id
     }  
   }  
    
