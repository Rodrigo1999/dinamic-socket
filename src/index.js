import io from 'socket.io-client';
import {simplesDispatch} from './utils';

let expo = {
    create({host, namespace='', options, store, ...other}){
        let o = {};
        return Object.keys(expo).reduce((obj, e)=>{
            o = {
                host, 
                namespace, 
                options, 
                store, 
                socket:(other.io || io).connect(host+namespace, options), 
                ...other
            }

            if((typeof expo[e]) == 'function'){
                obj[e] = expo[e].bind(o);
            }
            if(!obj.socket){
                obj.socket = o.socket
            }
            return obj;
        }, {})
    },
    on(name, model, _key, _remove, callback=()=>null){
        if(typeof name != 'string'){
            model = name.model;
            _key = name.key;
            _remove = name.remove;
            callback = name.callback;
            name = name.name;
        }
        
        if(Object.keys(this.socket.io._callbacks).find(e=> e=='$'+name)){
            this.socket.removeListener(name);
        }

       
        this.socket.on(name, (data, control={}) => {
            
            let key = control.key||_key;
            let remove = control.remove||_remove;
            let overwrite = control.overwrite;

            let returning = {
                type:'on',
                data,
                host:this.host,
                namespace:this.namespace,
                options:this.options,
                dispatch:simplesDispatch(model, key, remove, data, overwrite, this?.store)
            }

            
            this?.onSuccess?.(returning);
            callback?.(returning);
        });
    },
    emit(name, obj, model, key, remove, overwrite){
        if(typeof name != 'string'){
            model = name.model;
            obj = name.body;
            key = name.key;
            remove = name.remove;
            overwrite = name.overwrite;
            name = name.name;
        }
        
        return new Promise((resolve, reject)=>{
            this.socket.emit(name, obj, (data, err)=>{
                if(!err){
                    let returning = {
                        type:'emit',
                        data,
                        host:this.host,
                        namespace:this.namespace,
                        options:this.options,
                        dispatch:simplesDispatch(model, key, remove, data, overwrite, this?.store)
                    }
        
                    this?.onSuccess?.(returning);
                    resolve(returning);
                }else{
                    this?.onError?.(err);
                    reject(err)
                }
            })
        })
    }
}

export {io};
export const create = expo.create;
export const on = expo.on;
export const emit = expo.emit;

export default expo;