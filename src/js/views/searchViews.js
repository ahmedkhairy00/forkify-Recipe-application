class SearchViews {
    #parentEl = document.querySelector('.search');

    getQuery(){
        const query = this.#parentEl.querySelector('.search__field').value;
        this._clearInput();
        return query; 
    }
    addHandlerSearch(handler){
        this.#parentEl.addEventListener('submit', e => {
            e.preventDefault();
            handler();
        });
    };
    _clearInput(){
        this.#parentEl.querySelector('.search__field').value = '';
    };
}

export default new SearchViews();