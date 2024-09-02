/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/


import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'


// nouvel forme d'importation

const AuthController = () => import ('#controllers/auth_controller')
const SocialController = () => import ('#controllers/social_controller')
const ResetPasswordController = () => import ('#controllers/reset_password_controller')
const PostController = () => import ('#controllers/post_controller')



router.get('/',[PostController,'index'])
  .as('home')
  // .use(middleware.auth())

router.get('/register',[AuthController,'register'])
      .as('register')
      .use(middleware.guest())

router.post('/register',[AuthController,'handleRegister'])
      .use(middleware.guest())

router.get('/login',[AuthController,'login'])
      .as('login')
      .use(middleware.guest())

router.post('/login',[AuthController,'handleLogin'])
      .use(middleware.guest())
      .as('handle.login')

router.delete('/logout',[AuthController,'logout'])
      .as('logout').use(middleware.auth())

router.get('/forgot-password',[ResetPasswordController,'forgotPassword'])
      .as('forgot-password')
      .use(middleware.guest())

router.post('/forgot-password',[ResetPasswordController,'handleForgotPassword'])
      .use(middleware.guest())

router.get('/reset-password',[ResetPasswordController,'resetPassword'])
      .as('reset-password')
      .use(middleware.guest())

router.post('/reset-password',[ResetPasswordController,'handleResetPassword'])
      .as('handle-reset-password')
      .use(middleware.guest())

router.get('/github/redirect',[SocialController,'githubRedirect'])
      .use(middleware.guest())
      .as('github.redirect')

router.get('/github/callback',[SocialController,'githubCallback'])
      .use(middleware.guest())
      .as('github.callback')

router.get('/posts/create',[PostController,'create'])
      .as('post.create')
      .use(middleware.auth())

router.post('/posts/create',[PostController,'store'])
      .use(middleware.auth())

router.get('/posts/:slug/:id',[PostController,'show'])
      .as('post.show')
      .where('slug',router.matchers.slug())
      .where('id',router.matchers.number())

router.get('/posts/:id/edit', [PostController, 'edit'])
      .as('post.edit')
      .where('id', router.matchers.number())
      .use(middleware.auth())

router.put('/posts/:id/edit', [PostController, 'update'])
      .as('post.update')
      .where('id', router.matchers.number())
      .use(middleware.auth())

router.delete('/posts/:id/delete', [PostController, 'destroy'])
      .as('post.delete')
      .where('id', router.matchers.number())
      .use(middleware.auth())
