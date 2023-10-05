import { parse } from 'https://deno.land/std@0.203.0/csv/mod.ts'

const rawContent = Deno.readFileSync('./activities.csv')
const decodedContent = new TextDecoder().decode(rawContent)
const parsed = parse(decodedContent)

// TODO:
// - calculate average HR ("Average Heart Rate" column exists)
// - calculate time (elapsed or moving?)

// Remove header
parsed.shift()

// Calculate total distance for various types of activities
export const calculateTotalDistance = (
  activities: string[][],
  type?: 'gravel' | 'mtb' | 'virtual' | 'enduro'
) => {
  const total = activities.reduce((acc, activity) => {
    const activityName = activity[2].toLowerCase()
    const activityType = activity[3].toLowerCase()
    const distance = parseFloat(activity[6])

    switch (type) {
      case 'gravel':
        if (
          activityType === 'ride' &&
          !activityName.includes('mountain bike') &&
          !activityName.includes('mtb')
        ) {
          return acc + distance
        }

        return acc
      case 'mtb':
        if (
          activityType === 'ride' &&
          (activityName.includes('mountain bike') ||
            activityName.includes('mtb'))
        ) {
          return acc + distance
        }

        return acc
      case 'virtual':
        if (activityType === 'virtual ride') {
          return acc + distance
        }

        return acc
      case 'enduro':
        if (activityType === 'workout') {
          return acc + distance
        }

        return acc
      default:
        return acc + distance
    }
  }, 0)

  return total.toFixed(2)
}

// Print results
console.log('\n\n')
console.log('Total distance:', calculateTotalDistance(parsed), 'miles')
console.log(
  'Gravel bike distance:',
  calculateTotalDistance(parsed, 'gravel'),
  'miles'
)
console.log('MTB distance:', calculateTotalDistance(parsed, 'mtb'), 'miles')
console.log(
  'Zwift distance:',
  calculateTotalDistance(parsed, 'virtual'),
  'miles'
)
console.log(
  'Dirt bike distance:',
  calculateTotalDistance(parsed, 'enduro'),
  'miles',
  '\n\n'
)

// Just to catch activities that my filtering misses
const weirdNames = parsed.filter((activity) => {
  const activityName = activity[2].toLowerCase()
  const activityType = activity[3].toLowerCase()

  return (
    activityType === 'ride' &&
    !activityName.includes('mountain bike') &&
    !activityName.includes('mtb') &&
    !activityName.includes('morning') &&
    !activityName.includes('afternoon') &&
    !activityName.includes('evening') &&
    !activityName.includes('lunch') &&
    !activityName.includes('night')
  )
})

console.log(
  'Weird names:',
  weirdNames.map((activity) => activity[2]),
  '\n\n'
)
