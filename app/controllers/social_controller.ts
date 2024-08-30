import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class SocialController {

githubRedirect({ally}: HttpContext) {
    ally.use('github').redirect((req) => {
      req.scopes(['user'])
    })
}

async githubCallback({ ally, response, session,auth }: HttpContext) {

  const gh = ally.use('github')

  if (gh.accessDenied()) {
    session.flash('success', "vous avez annulé l'autorisation")
    return response.redirect().toRoute('login')
  }

  /**
   * OAuth state verification failed. This happens when the
   * CSRF cookie gets expired.
   */
  if (gh.stateMisMatch()) {
    session.flash('success', "erreur d'access lié au csrf")
    return response.redirect().toRoute('login')
  }

  /**
   * GitHub responded with some error
   */
  if (gh.hasError()) {
    session.flash('success', "erreur d'access")
    return response.redirect().toRoute('login')
  }

  /**
   * Access user info
   */
  const githubUser = await gh.user()
  const user = await User.findBy('email', githubUser.email)

  if (!user) {
  const newUser = await User.create({
      username: githubUser.name,
      email: githubUser.email,
      thumbnailUrl: githubUser.avatarUrl
    })
    await auth.use('web').login(newUser)

  }

  await auth.use('web').login(user!)
  session.flash('success', 'Connexion reussie')
  return response.redirect().toRoute('home')
}

}
