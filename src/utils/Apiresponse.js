class Apiresponse {
    constructor(statuscode , message= 'success' ,data =null ){
        this.statuscode = statuscode ;
        this.message = message ;
        this.data = data ;
    }
}

export  {Apiresponse} ; 
