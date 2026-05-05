import { ExclamationCircleIcon } from "@heroicons/react/16/solid";

export default function InputBox({ voiceText }) {
  console.log(voiceText);

  return (
    <div>
      <label
        htmlFor="email"
        className=" text-sm/6 font-medium text-gray-900 hidden"
      >
        Email
      </label>
      <div className="mt-2 grid grid-cols-1">
        <input
          id="email"
          name="email"
          type="email"
          disabled
          value={voiceText}
          placeholder={`Say "hello" to test your audio`}
          aria-invalid="true"
          aria-describedby="email-error"
          className="col-start-1 border-2 row-start-1 block w-full rounded-md bg-white py-6 pl-6 pr-10   outline-1 -outline-offset-1 outline-red-300 placeholder:text-gray-300 focus:outline-2 focus:-outline-offset-2 sm:pr-9 sm:text-sm/6"
        />
        <div className="pointer-events-none col-start-1 row-start-1 mr-28 size-5 self-center justify-self-end  ">
          <div className="inline-flex whitespace-nowrap items-center gap-2">
            {" "}
            <ExclamationCircleIcon
              aria-hidden="true"
              className=" text-red-500 sm:size-4"
            />{" "}
            Check audio
          </div>
        </div>
      </div>
    </div>
  );
}
