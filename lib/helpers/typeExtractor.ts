import { ModelPropertiesAccessor } from '@nestjs/swagger/dist/services/model-properties-accessor'
import { Constructor } from './getConstructor'
import { DECORATORS } from '@nestjs/swagger/dist/constants'
import { ApiPropertyOptions } from '@nestjs/swagger'
import { Definitions, EnumInfo, ObjectInfo, PropertyInfo } from '../interfaces'

type EnumValues = Array<string | number>

export class TypeExtractor {
  private readonly types: Map<string, ObjectInfo>
  private readonly enums: Map<string, EnumInfo>

  constructor (initial: Constructor[]) {
    this.types = new Map()
    this.enums = new Map()

    initial.forEach((type) => {
      this.addType(type)
    })
  }

  get (): Definitions {
    return {
      objects: this.types,
      enums: this.enums
    }
  }

  public addEnum (name: string, values: EnumValues): void {
    if (this.enums.has(name)) {
      return
    }

    const enumValues = values.map((value) => {
      return {
        name: value.toString().toUpperCase(),
        value
      }
    })

    this.enums.set(name, {
      name,
      values: enumValues
    })
  }

  public addType (Type: Constructor): void {
    const name = Type.name

    if (this.types.has(name)) {
      return
    }

    const instance = new Type()

    const accessor = new ModelPropertiesAccessor()
    const propertyNames = accessor.getModelProperties(instance)

    const properties = propertyNames.map((propertyName): PropertyInfo => {
      const { type, ...config } = Reflect.getMetadata(DECORATORS.API_MODEL_PROPERTIES, instance, propertyName) as ApiPropertyOptions

      const Constructor = type as Constructor

      let typeName = Constructor.name

      const enumInfo: EnumValues | undefined = config.enum as EnumValues

      if (enumInfo !== undefined) {
        typeName = propertyName.split(/(?=[A-Z])/).join('_').toUpperCase()
        config.example = config.example.toUpperCase()
        this.addEnum(typeName, enumInfo)
      }

      if (typeName !== 'String' && typeName !== 'Number' && typeName !== 'Boolean' && typeName !== 'Date' && enumInfo === undefined) {
        this.addType(Constructor)
      }

      return {
        name: propertyName,
        type: typeName,
        ...config
      }
    })

    this.types.set(name, properties)
  }
}
