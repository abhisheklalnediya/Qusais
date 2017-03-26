import moment from 'moment';

var Utils = {}
Utils.t = function (key){
	return key;
}
Utils.config = {
    pain_scale_min : 0,
    pain_scale_max : 10,
    eqvas_scale_min : 0,
    eqvas_scale_max : 100
}
Utils.deFormatDate = function (dString) {
    return moment(dString, Utils.dateFormat).format('YYYY-MM-DD');
}
Utils.formatDate = function (dString) {
    return moment(dString, Utils.dateFormat).format('DD.MM.YYYY');
}
Utils.assStatus = function (asmt) {
    var a = {
        status: "",
        class: "",
        icon: ""
    };
    var status = {
        'd': {
            text: Utils.t('Documenting'),
            class: "info",
            icon: "fa-clock-o"
        },
        'p': {
            text: Utils.t('Pending'),
            class: 'danger',
            icon: "fa-ban"
        },
        'c': {
            text: Utils.t('Documented'),
            class: 'primary',
            icon: "fa-check-circle-o"
        },
        'q': {
            text: Utils.t('Quiet'),
            class: 'danger',
            icon: "fa-ban"
        },
        'a': {
            text: Utils.t('Archived'),
            class: 'danger',
            icon: "fa-ban"
        }
    };
    if (asmt.documented)
    {
        a.status = status['c'].text;
        a.class = status['c'].class;
        a.icon = status['c'].icon;
    } else
    {
        a.status = status[asmt.status].text;
        a.class = status[asmt.status].class;
        a.icon = status[asmt.status].icon;
    }
    return a;
}

export default Utils