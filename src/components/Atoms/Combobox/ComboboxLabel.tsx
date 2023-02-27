import React from 'react'

interface ComboboxLabelProps {
  label: string
}

const ComboboxLabel = ({ label }: ComboboxLabelProps) => {
  return <h6 className="block text-sm font-medium text-gray-700">{label}</h6>
}

export default ComboboxLabel
