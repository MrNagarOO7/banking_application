import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export const AddSwagger = async (app: any) => {
  const config = new DocumentBuilder()
    .setTitle('Bank Application APIs')
    .setDescription('Swagger APIs')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/swagger-api/', app, document);
};
