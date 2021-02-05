## Instalação

```bash
    npm install --save dinamic-socket
```

## O que é o dinamic-socket ?
Muitas vezes fazemos nossas chamadas websocket na mão. Tendo em vista isso, é meio cansativo configurar como os dados devem ser manipulados.

É aí que entra o dinamic-socket, Buscador dinâmico para socket.io, inspirado no dinamicfetch, com ele você pode deixar mais fluido seu trabalho de salvar dados em loja, configurar ouvinte e emissão de eventos.

## Que metodologia ele trás?
Para você entender a metodologia dele, sugiro ler esse mesmo tópico no pacote **[dinamicfetch](https://www.npmjs.com/package/dinamicfetch)**

## Como usar?

Tendo em vista a mtodologia, partiremos para uso.

> Método create
```js
    // socket.config.js
    import dinamicsocket, {io, create, on, emit} from 'dinamic-socket';

    let socket = create({
        host:'https://host:port', //obrigatório
        store:Store,//opcional
        namespace:'/seu_namespace', //opcional, ficará assim https://host:port/seu_namespace
        options:{}, //opcional, opções do io.connect(<host>, <options>)
        io:require('socket.io-client'), //opcional, caso eu queira passar uma outra versão do socket.io externamente, pois nesse pacote estou utilizando a v3.1.1
        onSuccess(data){
            /*
                data retorna:

                {
                    <type> -> retorna o tipo de onSuccess, se ele veio de um ouvinte "on" ou se uma emissão "emit".
                    <data> -> dados retornados do servidor.
                    <host> -> host usado.
                    <namespace> -> namespace usado.
                    <options> -> opções usadas no socket.io no método connect
                    <dispatch> -> dados despachados.
                }
            */
        },
        onError(err){
            /*
                usado apenas para emit
                retorna um erro personalisado se ouver
            */
        }
    });

    /*
        socket retorna:

        {
            <create>, // o método create.
            <on>, //ouvinte de evento personalisado do dinamic-socket.
            <emit> // emissor de evento personalisado do dinamic-socket.
            <socket> //instância do socket.
        }
    */

```

<hr/>

> usos do método on
```js
    import socket, {on} from 'socket.config.js';

    on('<name>', '<model>', '<key>', '<remove>', '<callback>');

    /*
        name -> simplesmente é o endpoint da chamada.
        model -> é o model a ser utilizado da store para tratamento de dados. Obs: ver os casos de uso de dinamicfetch pra entender melhor.
        key -> se passado indico que quero alterar o determinado model da store com base nos dados que estou enviando do servidor.
        remove -> se passado em conjunto com a key, indica que quero remover um determinado item da store com base na key.
        callback -> retorna todos os dados visto em create->onSuccess
    */

    //outra forma de usar

    on({
        name:/*endpoint*/,
        model:/*model*/,
        key:/*key*/,
        remove:/*remove*/,
        callback:/*callback*/
    });

    /*
        você também pode controlar o key, remove e overwrite através do servidor também. Por exemplo:

        -------------------------------------------------------------------
        //server.js

        io.on('connection', socket=>{
            io.emit('users', {id:1, name:'Rodrigo'}, {key:'id', remove:true});

            //ou

            io.emit('users', {id:1, name:'Rodrigo'}, {overwrite:true});
        })

        -------------------------------------------------------------------

        o primeiro parâmetro é o endpoint, o segundo é os dados que vou enviar a esse endpoint, o terceiro é o controle do meu dinamic-socket.
        É importante manter esse padrão.
    */
```

<hr/>

> usos do método emit
```js
    import socket, {emit} from 'socket.config.js';

    socket.emit('<name>', '<body>', '<model>', '<key>', '<remove>', '<overwrite>'); //retorna uma promisse

    /*
        name -> simplesmente é o endpoint da chamada.
        body -> equivalente ao body de requisições http
        model -> é o model a ser utilizado da store para tratamento de dados. Obs: ver os casos de uso de dinamicfetch pra entender melhor.
        key -> se passado indico que quero alterar o determinado model da store com base nos dados que estou enviando do servidor.
        remove -> se passado em conjunto com a key, indica que quero remover um determinado item da store com base na key.
        overwrite -> indica se quero que os dados vindo do servidor sobrescreva meu model
    */

    //outra forma de usar

    socket.emit({
        name:/*endpoint*/,
        body:/*body*/,
        model:/*model*/,
        key:/*key*/,
        remove:/*remove*/,
        overwrite:/*overwrite*/
    });
```

<hr/>

> usos sem o create
```js
    import {on, emit} from 'dinamic-socket';

    on.bind({
        host, 
        namespace, 
        options, 
        store, 
        socket:io.connect(host+namespace, options),
    })('<name>', '<model>', '<key>', '<remove>', '<callback>');

    //o mesmo vale para emit
```