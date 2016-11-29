/**
 * Created by hades on 26/11/2016.
 */
var express = require('express');
var router = express.Router();
const pg= require('pg');
const conString='postgres://postgres:123456@localhost:5432/todo';
router.get('/todo',function (req,res) {
    pg.connect(conString,function (err,client,done) {
        if (err){
            res.end('Error when connect database!')
            return;
        }
        client.query('SELECT * from todos',function (err,result) {
            done();
            if(err){
                res.end('err when querysting');
                return;
            }
            // console.log(result);
            res.render('index', {data:result.rows});
            // res.json(result);
        })
    });
});
router.get('/delete/:id',function (req,res) {
    pg.connect(conString,function (err,client,done) {
        if (err){
            res.end('Error when connect database!')
            return;
        }
        console.log(req.params.id);
        client.query('delete from todos where id=($1)',[req.params.id],function (err,result) {
            done();
            if(err){
                res.end('err when querysting');
                return;
            }
            // console.log(result);
            res.redirect('/todo');

            // res.json(result);
        })
    });
});
router.get('/done/:id',function (req,res) {
    pg.connect(conString,function (err,client,done) {
        if (err){
            res.end('Error when connect database!')
            return;
        }
        console.log(req.params.id);
        client.query('update todos set completed=true where id=($1)',[req.params.id],function (err,result) {
            done();
            if(err){
                res.end('err when querysting');
                return;
            }
            // console.log(result);
            res.redirect('/todo');
            // res.json(result);
        })
    });
});

router.post('/todo',function (req,res) {
    pg.connect(conString,function (err,client,done) {
        if (err){
            res.end('Error when connect database!');
            return;
        }
        var newToDo=req.body.todo;
        console.log(newToDo);
        if (newToDo==""){
            res.redirect('/todo');

        }else{
            client.query('INSERT INTO todos(todo,completed) VALUES ($1,$2);',[req.body.todo,'false'],function  (err,result) {
                done();
                if(err){
                    res.end('err when querysting');
                    return;
                }
                // res.end('done');
                res.redirect('/todo');
            });
        }
    });
});
router.post('/edit/:id',function (req,res) {
    pg.connect(conString,function (err,client,done) {
        if (err){
            res.end('Error when connect database!');
            return;
        }
        var oldtodo;
        client.query('select todo from todos where id=$1',[req.params.id],function (err,result) {
            done();
            if(err){
                res.end('err when querysting');
                return;
            }
            oldtodo=result.rows;
            var changeTodo=req.body.todoedit;
            if (changeTodo=="" || changeTodo==oldtodo){
                res.redirect('/todo');
            }else{
                client.query('update todos set todo=$1 where id=$2;',[req.body.todoedit,req.params.id],function  (err,result) {
                    done();
                    if(err){
                        res.end('err when querysting');
                        return;
                    }
                    res.redirect('/todo');
                });
            }
        });
    });
});
router.post('/search',function (req,res) {
    pg.connect(conString,function (err,client,done) {
        if (err){
            res.end('Error when connect database!');
            return;
        }
        var str=req.body.searchtodo;
        console.log(str);
        console.log(req.params.id);
        if (str==""){
            res.redirect('/todo');
        }else{
            client.query('select todo from todos where todo like $1;',['%'+req.body.searchtodo+'%'],function  (err,result) {
                done();
                if(err){
                    res.end('err when querysting');
                    return;
                }
                // res.end('done');
                res.render('index', {data:result.rows});
            });
        }
    });
});
module.exports = router;
