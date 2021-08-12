<?php

namespace App\Controller\Api;

use App\Repository\ConfigRepository;
use App\Repository\UsersRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;


class GetConfig extends AbstractController
{
    /**
     * @var UsersRepository
     */
    protected $userRepo;

    /**
     * @var ConfigRepository
     */
    protected $configRepository;

    /**
     * GetConfig constructor.
     * @param UsersRepository $userRepo
     * @param ConfigRepository $configRepository
     */
    public function __construct(
                                UsersRepository $userRepo,
                                ConfigRepository $configRepository
                               )
    {
        $this->userRepository = $userRepo;
        $this->configRepository = $configRepository;
    }

    /**
     * @param $data
     * @return mixed
     * @throws \Exception
     */
    public function __invoke($id)
    {
        $user = $this->userRepository->find($id);

        $config = $this->configRepository->findConfigByUser($user)[0];

        return [
            'configuration' => $config,
            'message' => 'success',
        ];
    }
}