namespace components{
    class AuthenticationMiddleware{
        RequestDelegate next{get;set;}
        AuthenticationMiddleware(RequestDelegate next){
            this.next = next;
        }
        public async Task InvokeAsync(HttpContext context){
            
        }

    }

}