import React, {useState, useEffect} from 'react';
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
    on(name, model, _key, _remove, callback=()=>null, $callback=()=>null){
        if(typeof name != 'string'){
            model = name.model;
            _key = name.key;
            _remove = name.remove;
            callback = name.callback;
            name = name.name;
        }
        
        if([true, undefined].includes(this?.removeListener)){
            if(Object.keys(this.socket?._callbacks||{}).find(e=> e=='$'+name)){
                this.socket.removeListener(name);
            }
        }

        let {host, namespace, options, store} = this;

        let _this = this;

        function listen(data, control={}) {
            let key = control.key||_key;
            let remove = control.remove||_remove;
            let overwrite = control.overwrite;

            let returning = {
                type:'on',
                data,
                host,
                namespace,
                options,
                dispatch:simplesDispatch(model, key, remove, data, overwrite, store)
            }

            
            _this?.onSuccess?.(returning);
            callback?.(returning);
            $callback?.(returning);
        }
        this.socket.on(name, listen);
        return { 
            removeListener: () => this.socket.removeListener(name, listen),
            socket:this.socket
        }
    },
    $on(name, model, _key, _remove){
        
        let [data, setData] = useState({
            type:'',
            data:null,
            host:this.host,
            namespace:this.namespace,
            options:this.options,
            dispatch:{},
            removeListener(){}
        });

        useEffect(()=>{
            
            let socket = expo.on.call(this, name, model, _key, _remove, null, (data)=>{
                setData(_data => ({..._data, ...data}));
            });
            setData(data => ({...data, ...socket}))
        },[]);

        return data;
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