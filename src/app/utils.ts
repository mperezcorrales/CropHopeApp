const getDate = () => {
    const today = new Date();
    const dd = today.getDate();
    const mm = today.getMonth() + 1;
    const yyyy = today.getFullYear();
    let formattedDay = dd.toString();
    let formattedMonth = mm.toString();

    if (dd < 10) {
        formattedDay = '0' + dd;
    }

    if (mm < 10) {
        formattedMonth = '0' + mm;
    }
    return formattedDay + '/' + formattedMonth + '/' + yyyy;
};

export {getDate};
