import { writeFile } from 'fs/promises'
import { toPng } from "jdenticon";
import app from '@adonisjs/core/services/app'
import { cuid } from '@adonisjs/core/helpers';
import { MultipartFile } from '@adonisjs/core/bodyparser';

export default class FileUploaderService {

  async upload(thumbnail:MultipartFile | undefined , identiconName:string , path:string ){

    if (!thumbnail) {
      const png = toPng(identiconName, 100);
      await writeFile(`public/${path}/${identiconName}.png`, png);
    } else {
      await thumbnail.move(app.makePath(`public/${path}`), { name: `${cuid()}.${thumbnail.extname}` });
    }

    return  `${path}/${thumbnail ? thumbnail.fileName : identiconName + ".png"}`;
  }




}
