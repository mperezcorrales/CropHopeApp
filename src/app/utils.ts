const getDate = () => {
    const today = new Date();
    const dd = today.getDay();
    const mm = today.getMonth() + 1;
    const yyyy = today.getFullYear();
    let formattedDay;
    let formattedMonth;

    if (dd < 10) {
        formattedDay = '0' + dd;
    }

    if (mm < 10) {
        formattedMonth = '0' + mm;
    }

    return formattedMonth + '/' + formattedDay + '/' + yyyy;
};

export {getDate};
