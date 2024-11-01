<?php

namespace Websecret\Panel\Models\Traits;

trait AddressableTrait
{
    public function address()
    {
        $addressClass = config('panel.address_model');
        return $this->morphOne($addressClass, 'addressable');
    }

    public function saveAddress($data = []) {
        $addressClass = config('panel.address_model');
        $address = $this->address;
        if(!$address) {
            $address = new $addressClass();
            $address->addressable()->associate($this);
        }
        foreach($addressClass::$addressFields as $addressField) {
            $address->{$addressField} = array_get($data, 'address.'.$addressField, '');
        }
        $address->save();
    }

    public function getAddressStringAttribute() {
        $addressClass = config('panel.address_model');
        $address = $this->address;
        if(!$address) {
            return '';
        }
        $fields = [];
        foreach($addressClass::$addressFields as $addressField) {
            if($address->{$addressField}) {
                $fields[] = $address->{$addressField};
            }
        }
        return implode(', ', $fields);
    }


    protected static function bootAddressable()
    {
        static::created(function($model){
            $addressClass = config('panel.address_model');
            $address = new $addressClass();
            $address->addressable()->associate($model);
            $address->save();
        });

        static::deleted(function($model){
            $model->address()->delete();
        });
    }

    public function getAddressViewAttribute() {
        $addressClass = config('panel.address_model');
        $addressView = config('panel.address_view');
        return view($addressView, [
            'address' => $this->address ? $this->address : new $addressClass(),
            'fields' => $addressClass::$addressFields
        ]);
    }
}