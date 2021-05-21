
const observerMap = new WeakMap()

const createObserve = (el,vnode,modifiers,callBack)=>{
    const observer = new IntersectionObserver(entries=>{
        const entry = entries[0]
        if(entry.isIntersecting){
            callBack(el)
            if( modifiers && modifiers.once){
                
                disconnectObserver(observer)
            }
        }
    })
    vnode.context.$nextTick(()=>observer.observe(el))
    return observer
}

const disconnectObserver = (observer)=>{
  if(observer){
    observer.disconnect()
  }
}

const bind = (el,{value,modifiers },vnode) => {
    if (typeof window.IntersectionObserver === 'undefined') {
        throw('IntersectionObserver API is not available in your browser.')
      }else{
        const observer = createObserve(el,vnode,modifiers,(el)=>{
            const callback = value
            if(typeof callback === 'function')
            callback(el)
        })
        observerMap.set(el,{observer})
      }
}

const update = (el, { value, oldValue,modifiers }, vnode) =>{
    if(value === oldValue) return
    console.log(value,oldValue)
    const {observer} = observerMap.get(el)
    disconnectObserver(observer)
    bind(el,{value,modifiers},vnode)
}

const unbind = (el)=>{
    if(observerMap.has(el)){
        const {observer} = observerMap.get(el)
        disconnectObserver(observer)
        observerMap.delete(el)
    }
}

export default {
    bind,
    update,
    unbind
}