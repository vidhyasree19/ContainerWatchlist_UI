import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/register/register.component';
import { CosmosContainerComponent } from './components/container/container.component';
import { CartComponent } from './components/cart/cart.component';
import { PaymentSuccessComponent } from './components/payment/payment.component';

export const routes: Routes = [
    {path:'',component:LoginComponent},
    {path:'login',component:LoginComponent},

    {path:'register',component:RegistrationComponent},
    {path:'containers',component:CosmosContainerComponent},
    {path:'viewcart',component:CartComponent},
    {path:'payment',component:PaymentSuccessComponent}
];
