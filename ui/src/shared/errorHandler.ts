import { useAuthStore } from "@/stores/auth.store";


export const errorHandler = (error: any, errorMsg: string, context: any) => {
    const { logout } = useAuthStore();
    console.error(errorMsg, error);
    if(error.message.split(':')[0]=== 'AUTH'){
        logout();
    }else{
        context.alertMsg = errorMsg;
        context.alertIsError = true;
        context.showAlert = true;
    }
};
