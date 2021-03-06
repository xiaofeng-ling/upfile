var win = window,
    doc = win.document,
    bind = (win.addEventListener !== undefined) ? 'addEventListener' : 'attachEvent',
    CHANGE = (bind !== 'addEventListener') ? 'onchange' : 'change';

/**
 * Create a new instance of Upfile.
 * @constructor
 * @param {HTMLElement} el A given HTML element to create an instance of Upfile.
 * @returns {upfile} Returns a new instance of Upfile.
 */
function Upfile(el) {

    if (el === undefined) {
        throw new Error('"Upfile(el)": It must receive an element.');
    }

    this._initialize(el);
}

Upfile.prototype._initialize = function (el) {
    var that = this;

    this.el = el;
    this.container = this.el.parentNode;
    this.labelNode = this.container.children[0];
    that.labelNode.style.lineHeight = this.container.clientHeight + 'px';

    this._renderList();

    this.el[bind](CHANGE, function () {
        that._updateList(this.files);

        var obj = that.listNode.getBoundingClientRect(),
            listHeight = obj.bottom - obj.top,
            labelHeight = (listHeight > win.parseInt(that.labelNode.style.lineHeight, 10) ? listHeight : that.container.clientHeight);

        that.labelNode.style.height = that.labelNode.style.lineHeight = labelHeight + 'px';
    });

    this.el.upfile = this;

    return this;
};

Upfile.prototype._updateList = function (files) {
    var len = files.length,
        i = 0;

    this.listNode.innerHTML = '';

    if (len !== 0) {

        if (this.labelNode.className.search(/\s?upfile-label-hidden/) === -1) {
            this.labelNode.className += ' upfile-label-hidden';
            this.listNode.className = this.listNode.className.replace(/\s?upfile-hide/, '');
        }

        for (i; i < len; i += 1) {
            this.listNode.appendChild(this._renderFile(files[i].name));
        }

    } else {
        this.listNode.className += ' upfile-hide';
        this.labelNode.className = this.labelNode.className.replace(/\s?upfile-label-hidden/, '');
    }

    return this;
};

Upfile.prototype._renderList = function () {
    this.listNode = doc.createElement('ol');
    this.listNode.className = 'upfile-list upfile-hide';

    this.container.appendChild(this.listNode);

    return this;
};

Upfile.prototype._renderFile = function (name) {
    var li = doc.createElement('li');
    li.innerHTML = name;

    return li;
};

/**
 * Enables an instance of Upfile.
 * @memberof! Upfile.prototype
 * @function
 * @returns {upfile} Returns the instance of Upfile.
 */
Upfile.prototype.enable = function () {
    this.el.removeAttribute('disabled');
    this.labelNode.className = this.labelNode.className.replace(/\s?upfile-label-disabled/, '');

    return this;
};

/**
 * Disables an instance of Upfile.
 * @memberof! Upfile.prototype
 * @function
 * @returns {upfile} Returns the instance of Upfile.
 */
Upfile.prototype.disable = function () {
    this.el.setAttribute('disabled', 'disabled');
    this.labelNode.className += ' upfile-label-disabled';

    return this;
};

// Expose Upfile
exports = module.exports = Upfile;