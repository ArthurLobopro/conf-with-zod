# conf-with-zod

[conf](https://www.npmjs.com/package/conf) package with zod as json validator

## Install

```sh
npm install conf-with-zod
```

## Usage

This package works almost identical that original `conf`, with these diferences: 

* In the property schema you NEED to pass a zod object validator like this:

```typescript 
const zodSchema = z.object({
	foo: z.string().optional().default("Bar")
})

const store = new Conf({
	schema: zodSchema
})
```

## Credits

All rigths reserved to [sindresorhus](https://github.com/sindresorhus), owner of the original conf.