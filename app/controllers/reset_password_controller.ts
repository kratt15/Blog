 import Token from '#models/token'
import User from '#models/user'
import { forgotPasswordValidator } from '#validators/auth'
import stringHelpers from '@adonisjs/core/helpers/string'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

export default class ResetPasswordController {

forgotPassword({view}: HttpContext) {

  return view.render('pages/auth/forgot_password')

}

async handleForgotPassword({request,response,session}: HttpContext) {
  const {email} = await request.validateUsing(forgotPasswordValidator)
const user = await  User.findBy('email',email)

if(!user || user.password === null) {
  session.flash('error', 'Email introuvable')
  return response.redirect().toRoute('login')

}

const token = stringHelpers.generateRandom(64)
const url = `http://localhost:3333/reset-password?token=${token}&email=${email}`

await Token.create({
  token,
  email : user.email,
  expiresAt:DateTime.now().plus({minutes: 20})

})

session.flash('success', ' un email vous a été envoyé')
return response.redirect().toRoute('forgot-password')
}

}
