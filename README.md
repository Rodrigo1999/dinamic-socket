## Instalação

```bash
    npm install --save dinamic-socket
```

## O que é o dinamic-socket ?
Muitas vezes fazemos nossas chamadas websocket na mão. Tendo em vista isso, é meio cansativo configurar como os dados devem ser manipulados.

É aí que entra o dinamic-socket, buscador dinâmico para socket.io, inspirado no dinamicfetch, com ele você pode deixar mais fluido seu trabalho de salvar dados em loja, configurar ouvinte e emissão de eventos.

## Que metodologia ele trás?
Para você entender a metodologia dele, sugiro ler esse mesmo tópico no pacote **[dinamicfetch](https://www.npmjs.com/package/dinamicfetch)**

## Como usar?

Tendo em vista a metodologia, partiremos para o uso.

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

## Estruturando o lado do servidor
### O que vou mostrar abaixo não é obrigatório para você usar o dinamic-socket (exceto um detalhe que há lá em baixo) mas sim uma sugestão de como você pode arquitetar seu socket.io no lado do servidor.

> Estruturas de pastas e arquivos.

- socket
    - controller
        - private
            - todos os endpoints privatos
        - public
            - todos os endpoints públicos
        - global
            - todos os endpoints global
    - index.js


Dentro de cada pasta private, public, global posso criar os arquivos que eu quiser.

Agora vamos trabalhar o index.js

```js
    let glob = require('glob');
    let path = require('path');

    module.exports = (io) => {
        
        // ------------------------------------------socket privado-----------------------------------------------------------------------
        io.of('/private').use((socket, next) => {
            
            let query = socket.handshake.query;
            let {token} = query;
            
            if(query && token){
                try{
                    /* 
                        Aqui você faz sua verificação de login para sockets privados, pode usar o jwt se quiser, eu costumo usar ele para token.
                        Se as validações ocorrerem corretamente você chama o next().
                        Se não, você emite um evento de erro para o endpoint destino.
                     */
                }catch(err){
                    
                }
            }
        }).on('connection', (socket)=>{

            //uso o glob para lstar todos os arquivos do diretório passado e em seguida importa-los.
            glob.sync(path.join(__dirname, "controller", 'private', '*.js')).forEach(e=>{
                require(e)(io, socket);
            });

            glob.sync(path.join(__dirname, "controller", 'global', '*.js')).forEach(e=>{
                require(e)(io, socket);
            });
        });

        // ------------------------------------------socket público-----------------------------------------------------------------------
        io.of('/public').on('connection', (socket) => {

            glob.sync(path.join(__dirname, "controller", 'public', '*.js')).forEach(e=>{
                require(e)(io, socket);
            });

            glob.sync(path.join(__dirname, "controller", 'global', '*.js')).forEach(e=>{
                require(e)(io, socket);
            });
        });
    }
```

No seu app.js, arquivo raiz da aplicação em muitos casos, você chama `require('./socket')(io);`

Fazemos assim dentro dos diretórios por exemplo.
Essa é só uma ilustração, você pode separar as camadas em controller, services e repository
```js
    // controller/private/teste.js
    module.exports = (io, socket)=>{
        socket.on('scheduling', async (data, callback)=>{
            /* 
                Quando for usar callback passe assim callback(<data>, <error>);
                O primeiro parâmetro é os dados que você quer emitir e o segundo é erro se ouver.
                Se não tiver erro, passe o segundo parâmetro como nulo e vice-versa.

                Essa regra é obrigatório para o callback do socket.emit do client funcionar bem.
             */
        })
    }
```

# Casos de uso

Mais uma vez atento a olhar a doc do dinamicfetch para entender o metodologia por trás do dinamic-socket.
Os retorno de dados do servidor para client funciona de maneira semelhante ao pacote mencionado, a diferença é que eu incluo um control em certos casos. Por exemplo:

```js
    io.emit('users', {id:1, name:'Rodrigo'}, {key:'id', remove:true});

    //ou

    io.emit('users', {id:1, name:'Rodrigo'}, {overwrite:true});
```

O terceiro parâmetro de envio também controla sobre como os dados irão se comportar.
Fora isso, os padrões de envio de solicitação é o mesmo do dinamic-fetch, no caso aqui, serve tanto para io.emit como para callback.