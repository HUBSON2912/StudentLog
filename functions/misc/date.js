export function dateToDDMMYYYY(date) {
    if (!(date instanceof Date))
        return "";
    return `${String(date.getDate()).padStart(2, "0")}.${String(date.getMonth() + 1).padStart(2, "0")}.${date.getFullYear()}`
}

export function DDMMYYYYToDate(dmy) {
    try {
        const [d, m, y] = dmy.split(".").map(x=>parseInt(x));
        return new Date(y, m - 1, d);
    }
    catch (error) {
        console.error(`Unexpected error: ${JSON.stringify(error)}`);
        return "";
    }
}


/**
 * 
 * @param {*} d 
 * @param {*} m 
 * @param {*} y 
 * @returns {boolean}
 * @description Check if date is correct
 */
export function parseDate(d,m,y) {
    if(d>31 || m>12 || d<=0 || m<=0)
        return false;
    
    const months30=[4,6,9,11];
    if(months30.includes(m)) {
        if(d>30)
            return false;
    }

    // condision for 31 days is checked in the first if

    // is leap year
    if(y%4==0 && (y%100!=0 || y%400==0)) {
        if(m==2) {
            if(d>29)
                return false;
        }
    }
    else if(m==2) {
        if(d>28) {
            return false;
        }
    }

    return true;
}

/**
 * 
 * @param {string} str Date DD.MM.YYYY. MM is in range [1, 12]
 * @returns {boolean|Date} Returns Date object if the string is DD.MM.YYYY and false if it's not
 */
export function isDDMMYYYYDateFormat(str) {
    const regex = /^\d{1,2}\.\d{1,2}\.\d{4}$/;

    if(typeof(str)!=="string")
        return false;

    // if str is like xx.xx.xxxx
    if(!(str.match(regex)))
        return false;

    const [d,m,y]=str.split('.').map(x=>parseInt(x));
    if(!parseDate(d,m,y)) 
        return false;
    const res=new Date(y,m-1,d);
    return new Date(y,m-1,d);
}