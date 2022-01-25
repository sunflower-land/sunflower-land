<?php
    // Hide errors
    error_reporting(0);
    ini_set('display_errors', 0);
    // JSON file name created
    $input_filename = $argv[1];
    // Output file name
    $output_filename = $argv[2];
    // award_total is the total number of SFF in the pool during snapshot
    $award_total = $argv[3];

    // Read the JSON file
    if (!$json = file_get_contents($input_filename)) {
        echo "$input_filename file doesn't exist.";
        exit();
    }
    // Decode the JSON file
    $json_data = json_decode($json,true);

    $datas = $json_data['data']['items'];
    $total_balance_adjusted = 0;

    function exp2int($exp) {
        if (strpos(strtolower($exp), 'e') !== false  ) {
            list($mantissa, $exponent) = explode("e", strtolower($exp));
            if($exponent=='') return $exp;
            list($int, $dec) = explode(".", $mantissa);
            bcscale (abs($exponent-strlen($dec)));
            return bcmul($mantissa, bcpow("10", $exponent));
        } else {
            return $exp;
        }
    }


    $list  = [];

    $list[] =
        [
            'contract_name' => 'contract_name',
            'contract_ticker_symbol' => 'contract_ticker_symbol',
            'contract_address' => 'contract_address',
            'address' => 'address',
            'balance_adjusted' => 'balance_adjusted',
            'percent' => 'percent',
            'block_height' => 'block_height',
            'award' => 'award'
        ];


    foreach($datas as $data) {
        $data['balance'] = substr_replace($data['balance'], '00000000000000000000000000', 0, 0);
        $data['balance'] = substr_replace($data['balance'], '.', intval(strlen($data['balance']) - $data['contract_decimals']), 0);
        $total_balance_adjusted = $total_balance_adjusted + floatval($data['balance']);
    }

    foreach ($datas as $data) {
        $data['balance'] = substr_replace($data['balance'], '00000000000000000000000000', 0, 0);
        $data['balance'] = substr_replace($data['balance'], '.', intval(strlen($data['balance']) - $data['contract_decimals']), 0);

        $contract_name = $data['contract_name'];
        $contract_address = $data['contract_address'];
        $contract_ticker_symbol = $data['contract_ticker_symbol'];
        $address = $data['address'];
        // $balance_adjusted = substr_replace($data['balance'], '.', (strlen($data['balance']) - $data['contract_decimals']) , 0);

        $balance_adjusted = floatval($data['balance']);
        $percent = floatval($data['balance']) / floatval($total_balance_adjusted);
        $block_height = $data['block_height'];
        $award = $percent * $award_total;

        $list[] = [
            'contract_name' => $contract_name,
            'contract_ticker_symbol' =>  $contract_ticker_symbol,
            'contract_address' => $contract_address,
            'address' => $address,
            'balance_adjusted' => exp2int(strval($balance_adjusted)),
            'percent' => exp2int(strval($percent)),
            'block_height' => $block_height,
            'award' => exp2int(strval(round(floatval($award), 5)))
            // 'award' => strval(floatval($award))
        ];
    }

    try {
        $fp = fopen($output_filename, 'w');

        foreach ($list as $fields) {
            fputcsv($fp, $fields);
        }

        echo "$output_filename file was generated successfully.";
    } catch(Exception $e) {
        echo 'Error occured.';
    }
?>
