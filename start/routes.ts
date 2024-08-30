/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import AuthController from '#controllers/auth_controller'
import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import SocialController from '#controllers/social_controller'

router.on('/').render('pages/home').as('home')

router.get('/register',[AuthController,'register'])
      .as('register').use(middleware.guest())
router.post('/register',[AuthController,'handleRegister']).use(middleware.guest())

router.get('/login',[AuthController,'login'])
      .as('login').use(middleware.guest())
router.post('/login',[AuthController,'handleLogin']).use(middleware.guest())

router.delete('/logout',[AuthController,'logout'])
      .as('logout').use(middleware.auth())

router.get('/github/redirect',[SocialController,'githubRedirect']).use(middleware.guest()).as('github.redirect')

router.get('/github/callback',[SocialController,'githubCallback']).use(middleware.guest()).as('github.callback')
