import User from '#models/user'
import { registerUserValidator } from '#validators/auth'
import { cuid } from '@adonisjs/core/helpers'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import { toPng } from "jdenticon"
import { writeFile } from 'fs/promises'



export default class AuthController {

   register({view}: HttpContext) {
      return view.render('pages/auth/register')
  }
   login({view}: HttpContext) {
    return view.render('pages/auth/login')
  }

//  async handleRegister({request,session,response}: HttpContext){

//    const{username,email,thumbnail,password} = await request.validateUsing(registerUserValidator)
//     if(!thumbnail){
//         const png = toPng(username,100)
//          await writeFile(`public/users/${username}.png`, png)
//     }else{
//       await thumbnail.move(app.makePath("public/users"),{name:`${cuid()}.${thumbnail.extname}`})
//     }
//     const filePath = `users/${thumbnail?.fileName || username+".png"}`
//     await User.create({username,email,password,thumbnail:filePath})
//     session.flash('success','Inscription reussie !!')
//     return response.redirect().toRoute('login')
//     //  console.log(res);
//     //   return res
//    }
async handleRegister({ request, session, response }: HttpContext) {
  try {
    const { username, email,  password, thumbnail} = await request.validateUsing(registerUserValidator);

    if (!thumbnail) {
      const png = toPng(username, 100);
      await writeFile(`public/users/${username}.png`, png);
    } else {
      await thumbnail.move(app.makePath("public/users"), { name: `${cuid()}.${thumbnail.extname}` });
    }

    const filePath = `users/${thumbnail ? thumbnail.fileName : username + ".png"}`;

    await User.create({
      username,
      email,
      password,
      thumbnailUrl: filePath
    });

    session.flash('success', 'Inscription réussie !!');
    return response.redirect().toRoute('login');

  } catch (error) {

    console.error('Erreur lors de l\'inscription:', error);
    session.flash('error', 'Une erreur s\'est produite lors de l\'inscription.');
    return response.redirect().back();
  }


}


}
