# Gym Workout Programme Data

## Files
- `gym_workout_program.json`: normalized trainer programme, ordered as received.

## Structure
- `blocks[]`: programme blocks / weeks.
- `days[]`: training days within each block.
- `cardio`: activity and duration.
- `exercises[]`: prescribed exercises, sets, reps, duration and weight details.

## Important conventions
- `10x3` means 3 sets x 10 reps.
- `30 sec x 4` means 4 sets x 30 seconds.
- Unknown weights are `null`, never zero.
- Weight ranges and suggestions are preserved in `weight_note`.
- The initial Tuesday-Saturday block is partial.
- The repeated block is retained and identified with `duplicate_of`.

## Recommended app data separation
Keep the trainer's prescribed programme separate from the user's actual workout logs. Never overwrite a prescription when recording what the user actually lifted.
