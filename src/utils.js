import shaper from './shaper';
let expo = {
    tryData(data, model){
        try{
            return data[model] || data;
        }catch(err){
            return data;
        }
    },
    simplesShaper(model, key, remove=[], data, overwrite, store){
        let _shaper = {};

        if(model && store){
            let models = (model||'').split(',').map(e => e.trim());
            key = (key||'').split(',').map(e => e.trim());
            let _remove = [].concat(remove);

            _shaper = models.reduce((obj, model, i)=>{

                let method = 'post';

                if(key[i]) method = _remove[i] ? 'delete' : 'put';
                if(overwrite) method = 'get';

                obj[model] = shaper({
                    method, 
                    key:key[i], 
                    model, 
                    data:expo.tryData(data, model), 
                    store
                });
                return obj;
            }, {});
        }
        return _shaper
    }
}

export let simplesShaper= expo.simpleShaper;
export let tryData = expo.tryData;
export default expo;