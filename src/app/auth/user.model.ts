export class User {
  constructor(
    public id: string,
    public email: string,
    public name:string,
    public username:string,
    public firstName:string,
    public lastName:string,    
    public photoUrl:string,
    public scnt:Number,
    public dcnt:Number,
    public ccnt:Number,
    public stripeId:string,
    private _token: string,
    private _tokenExpirationDate: Date,
  ) {}

  get token() {
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
      return null;
    }
    return this._token;
  }
}
