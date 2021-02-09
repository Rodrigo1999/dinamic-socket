import dispatch from './dispatch';
let expo = {
    tryData(data, model){
        try{
            return data[model] || data;
        }catch(err){
            return data;
        }
    },
    simplesDispatch(model, key, remove=[], data, overwrite, store){
        let _dispatch = {};

        if(model && store){
            let models = (model||'').split(',').map(e => e.trim());
            key = (key||'').split(',').map(e => e.trim());
            let _remove = [].concat(remove);

            _dispatch = models.reduce((obj, model, i)=>{

                let method = 'post';

                if(key[i]) method = _remove[i] ? 'delete' : 'put';
                if(overwrite) method = 'get';

                obj[model] = dispatch({
                    method, 
                    key:key[i], 
                    model, 
                    data:expo.tryData(data, model), 
                    store
                });
                return obj;
            }, {});
        }
        return _dispatch
    }
}

export let simplesDispatch = expo.simplesDispatch;
export let tryData = expo.tryData;
export default expo;