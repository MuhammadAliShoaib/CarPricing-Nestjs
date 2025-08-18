import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { map, Observable } from "rxjs";
import { UserDto } from "src/users/dtos/user.dto";


interface ClassConstructor {
    new (...args : any[]) : {}
}

export function Serialize(dto : ClassConstructor){
    return UseInterceptors(new SerializeIntercepetor(dto))
}

export class SerializeIntercepetor implements NestInterceptor {

    constructor(private dto : any){}

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {    
        //run here before a request is handle by request handler
        // console.log('RUN BEFORRRRRR HANDLERRRR',context)

        return next.handle().pipe(
            map((data : any)=>{
                // run here before the response is sent out
                // console.log("BEFOREEE REQUEST SENT OUTTTT",data)

                return plainToClass(this.dto,data,{
                    excludeExtraneousValues : true
                })
            })
        )
    }
}