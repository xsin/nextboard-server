import fs from 'node:fs/promises'
import path from 'node:path'
import { Injectable } from '@nestjs/common'
import juice from 'juice'
import { template } from 'radash'

@Injectable()
export class TemplateService {
  private templatesDir = path.join(__dirname, 'templates')

  async render(templateName: string, context: any): Promise<string> {
    const templatePath = path.join(this.templatesDir, `${templateName}.html`)
    const templateContent = await fs.readFile(templatePath, 'utf-8')
    const juiceHtml = juice(templateContent)
    return template(juiceHtml, context)
  }
}
