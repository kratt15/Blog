 import Token from '#models/token'
import User from '#models/user'
import { forgotPasswordValidator, resetPasswordValidator } from '#validators/auth'
import stringHelpers from '@adonisjs/core/helpers/string'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import mail from '@adonisjs/mail/services/main'

export default class ResetPasswordController {

forgotPassword({view}: HttpContext) {

  return view.render('pages/auth/forgot_password')

}

async handleForgotPassword({request,response,session}: HttpContext) {
  const {email} = await request.validateUsing(forgotPasswordValidator)
const user = await  User.findBy('email',email)

if(!user || user.password === null) {
  session.flash('success', 'Email introuvable')

  return response.redirect().toRoute('login')

}

const token = stringHelpers.generateRandom(64)
const url = `http://localhost:3333/reset-password?token=${token}&email=${email}`

await Token.create({
  token,
  email : user.email,
  expiresAt:DateTime.now().plus({minutes: 20})

})

// email
await mail.send((message) => {
  message
    .to(user.email)
    .from('info@example.org')
    .subject('demande de reinitialisation de mot de passe ')
    .htmlView('emails/forgot_password',{user,url})
})
mail
session.flash('success', ' un email vous a été envoyé')
return response.redirect().toRoute('forgot-password')
}


async resetPassword({request,session,response,view}: HttpContext) {

  const{email,token}= request.only(['email','token'])

  const tokenObj = await Token.findBy('token',token)

  if(!tokenObj || tokenObj.expiresAt < DateTime.now() || tokenObj.email !== email || !!tokenObj.isUsed === true) {

    session.flash('error', 'Token invalide ou expiré')
    return response.redirect().toRoute('forgot-password')
  }
  return view.render('pages/auth/reset_password',{email,token})

}


async handleResetPassword({request,session,response}: HttpContext)
{
  const{token,email,password} = await request.validateUsing(resetPasswordValidator)

  const tokenObj = await Token.findBy('token',token)

  if(!tokenObj || tokenObj.expiresAt < DateTime.now() || tokenObj.email !== email || !!tokenObj.isUsed === true) {

    session.flash('error', 'Token invalide ou expiré')
    return response.redirect().toRoute('forgot-password')
  }
  const user = await User.findBy('email',email)

  if(!user) {

    session.flash('error', 'Utilisateur introuvable')
    return response.redirect().toRoute('forgot-password')
  }
  await tokenObj.merge({isUsed:true}).save()
  await user.merge({password}).save()

  session.flash('success', 'le mot de passe a bien été modifié')
  return response.redirect().toRoute('login')
}

}
