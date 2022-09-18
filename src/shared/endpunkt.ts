export class Endpunkt {

  public fullUrl:string;

  constructor(public host: string, public port: string, public path: string, public resource: string, public url?:string) {
    this.fullUrl=`${this.host?this.host:''}${this.port?this.port:''}${this.path?this.path:''}${this.resource?this.resource:''}${this.url?this.url:''}`;
  }

  toUrl(): string {
    return this.fullUrl;
  }
}
