const mongoose = require('mongoose');
const express = require('express')
const { graphqlHTTP } = require('express-graphql');
const {buildSchema} = require('graphql');
const User = require('./mongo/user');
const Board = require('./mongo/board');
const PORT = 3000
const app = express()
app.use(express.json());
app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
const schema = buildSchema(` 
input UserInput {       
        firstName: String       
        lastName: String       
        emailAddress: String!       
        password: String!     
    }    
      
    type User {        
        _id: String        
        firstName: String        
        lastName: String        
        emailAddress: String
    }  
     input BoardInput {            
        owner: String        
    } 
     type Board {        
        _id: String               
        owner: String 
    }
     input editorInput { 
        boardId: String           
        editor: String        
    } 
     type Editor { 
        boardId: String                      
        editor: String 
    }
     input postitInput {
        boardId:String,
        text:String,
        author:String,
        x:String,
        y:String,
       }
     type Postit { 
        _id: String
        text:String,
        author:String,
        x:String,
        y:String,
        }
     input updatepostitInput {
        boardId:String,
        postitId:String,
        text:String,
        author:String,
        x:String,
        y:String,
       }   
     input deletepostitInput { 
        boardId: String           
        postitId: String        
    } 
     type DeletePostit { 
                              
        postitId: String  
    }   
    input deleteBoardInput { 
        boardId: String           
              
    } 
     type DeleteBoard { 
                              
        boardId: String  
    }
      
    type Query {     
        userById(id:String!): User     
        userByName(name:String!): User         
    }    
    type Mutation {     
        createUser(user: UserInput): User   
        createBoard(board: BoardInput): Board 
        addBoardEditor(editor: editorInput): Editor   
        addBoardPostit(postit: postitInput): Postit
        deleteBoardEditor(editor: editorInput): Editor 
        deleteBoardPostit(deletePostit: deletepostitInput): DeletePostit
        updateBoardPostit(postit: updatepostitInput): Postit 
        deleteBoard(deleteboard: deleteBoardInput): DeleteBoard
          
        
    }  
     
    `);
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: {
        async userById({id}){
            const user = await User.findById(id);
            return user;
        },
        async userByName({name}){
            const user = await User.findOne({emailAddress: name});
            return user;
        },
        async createUser({user}){
            const model = new User(user);
            await model.save();
            return model;
        },

        async createBoard({board}){
            const model = new Board(board);
            await model.save();
            return model;
        },
        async addBoardEditor({editor}){

            const board = await Board.findOne({_id: editor.boardId});
            console.log(board)
            board.editor.push(editor.editor);

            await board.save();
        },

        async addBoardPostit({postit}){

            const board = await Board.findOne({_id: postit.boardId});

            console.log(board)
            board.postits.push(postit);

            await board.save();
        },
        async updateBoardPostit({postit}){
            console.log(postit)
            const board = await Board.findOne({_id: postit.boardId});

            const postIt = postit.postitId

            console.log(board)
            for(let i=0;i < board.postits.length; i++){
                if (postIt==board.postits[i]._id){

                    board.postits[i].overwrite(postit);

                    console.log(board);
                    await board.save();
                    break


                }else {
                    console.log('nichts');
                }
            }

            await board.save();
        },
        async deleteBoardPostit({deletePostit}){
            console.log(deletePostit);
            const board = await Board.findOne({_id: deletePostit.boardId});
            console.log(board)
            let postIt = deletePostit.postitId;

            for(let i=0;i < board.postits.length; i++){
                if (postIt==board.postits[i]._id){
                    board.postits.splice(i,1);

                    await board.save();
                    break


                }else {
                    console.log('nichts');
                }
            }

        },
        async deleteBoardEditor({editor}){

            console.log('hallo');

            const board = await Board.findOne({_id: editor.boardId});
            console.log(board)
            let editorId = editor.editor;

            for(let i=0;i < board.editor.length; i++){
                if (editorId==board.editor[i]){

                    board.editor.splice([i]);

                    board.save();

                    console.log(board.editor);
                }else {
                    console.log(board.editor[i]);
                }
            }

        },
        async deleteBoard({deleteboard}){
            console.log(deleteboard)
             Board.deleteOne({ _id: deleteboard.boardId}, function (err) {
                if(err) console.log(err);
                console.log("Successful deletion");
            });

        },
    },

    graphiql: true,
}));
mongoose.connect('mongodb://localhost:27017', {
    user: 'root',
    pass: 'example',
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true}, error => {
    if(!error) {
        app.listen(PORT, () => {
            console.log(`Example app listening at http://localhost:${PORT}`)
        })
    } else {
        console.error('Failed to open a connection to mongo db.', error);
    }
});