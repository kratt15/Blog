
import Post from '#models/post'
import FileUploaderService from '#services/file_uploader_service'
import { storePostValidator } from '#validators/post'
import { inject } from '@adonisjs/core'
import stringHelpers from '@adonisjs/core/helpers/string'
import type { HttpContext } from '@adonisjs/core/http'

 @inject()
export default class PostController {
  /**
   * Display a list of resource
   */

  constructor( private readonly fileUploaderService: FileUploaderService){

  }


  async index({}: HttpContext) {}

  /**
   * Display form to create a new record
   */
  async create({view}: HttpContext) {
    return view.render('pages/post/create')
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request,auth,session,response }: HttpContext) {

      const {title,thumbnail,content} =  await request.validateUsing(storePostValidator)
      const slug =stringHelpers.slug(title).toLocaleLowerCase()
      const filePath = await this.fileUploaderService.upload(thumbnail,slug,'posts')

      await Post.create({
        title,
        slug,
        thumbnail:filePath,
        content,
        userId: auth.user!.id
      })
      session.flash('success', 'votre article a bien été publié')
      return response.redirect().toRoute('home')

  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {}

  /**
   * Edit individual record
   */
  async edit({ params }: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {}

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {}
}
